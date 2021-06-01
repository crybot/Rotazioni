from pulp import LpMinimize, LpMaximize, LpProblem, LpStatus, lpSum, LpVariable

def weekday(day):
    return {0: 'MONDAY', 1: 'TUESDAY', 2: 'WEDNESDAY', 
            3: 'THURSDAY', 4: 'FRIDAY', 5: 'SATURDAY', 
            6: 'SUNDAY'}[day % 7]

def crange(start, end, modulo):
    if start > end:
        while start < modulo:
            yield start
            start += 1
        start = 0

    while start < end:
        yield start
        start += 1

class MuscleGroup:
    def __init__(self, name, rest_min=4, rest_max=5, rotations=3, after_rest=False):
        self.name = name
        self.rest_min = rest_min
        self.rest_max = rest_max
        self.rotations = rotations
        self.after_rest = after_rest
        self.split_preference = set([])

    def set_split_preference(self, preference):
        self.split_preference = set(preference)

class SplitScheduler:
    def __init__(self, groups, days, rest_days, 
            max_consecutive_work=3, max_consecutive_rest=2):
        self.groups = groups
        self.days = range(days)
        self.rest_days = rest_days
        self.max_consecutive_work = max_consecutive_work
        self.max_consecutive_rest = max_consecutive_rest
        self._setup_variables()
        self._setup_constraints()

    def _setup_variables(self):
        # Initialize the decision variables
        self.X = {}
        self.Y = []

        # X_i_j := Muscle group i is trained on the j-th day, i \in groups, j \in [0,14)
        for group in self.groups:
            for day in self.days:
                self.X[group.name, day] = LpVariable(name='x_{}_{}'.format(group.name, day), cat='Binary')

        # Y_j := the j-th day is a rest day, j \in [0, 14)
        for day in self.days:
            self.Y.append(LpVariable(name='y_{}'.format(day), cat='Binary'))

        # Z := the maximum number of muscle groups trained in any given day
        # <=>
        # Z := max_j { sum_i (X_i_j) }
        self.Z = LpVariable(name='z', lowBound=0, upBound=len(self.groups), cat='Integer')

    def _setup_constraints(self):
        # Model definition
        model = LpProblem(name='workout-split-scheduling', sense=LpMinimize)

        # Each muscle group i must be hit exactly i.rotations times each microcycle 
        for group in self.groups:
            model += sum( [ self.X[group.name, day] for day in self.days ] ) == group.rotations
            
        # In each microcycle there have to be exactly `rest_days` rest days
        model += sum(self.Y) == self.rest_days

        # Max consecutive days of training/resting constraints
        for day in self.days:
            maxwork = crange(day, (day + self.max_consecutive_work + 1) % len(self.days), len(self.days))
            maxrest = crange(day, (day + self.max_consecutive_rest + 1) % len(self.days), len(self.days))
            model += sum( [ (1 - self.Y[d]) for d in maxwork ] ) <= self.max_consecutive_work
            model += sum( [ self.Y[d] for d in maxrest ] ) <= self.max_consecutive_rest

        # For each day j, if self.Y_j is set to 1 (j is a rest day), there must be no workouts scheduled for that day
        # and if self.Y_j is set to 0, there has to be at least one muscle group scheduled for that day
        for day in self.days:
            model += sum( [ self.X[group.name, day] for group in self.groups ] ) <= (1 - self.Y[day])*1000000
            model += sum( [ self.X[group.name, day] for group in self.groups ] ) >= (1 - self.Y[day])

        # Threshold variable constraint (self.Z must represent the maximum number of muscle groups trained in any given day)
        for day in self.days:
            model += sum( [ self.X[group.name, day] for group in self.groups ] ) <= self.Z
            
        # Constraints determining the minimum and maximum number of days between two consecutive muscle group workouts
        for group in self.groups:
            for day in self.days:
                maxdays = crange(day, (day + group.rest_max + 1) % len(self.days), len(self.days))
                mindays = crange(day, (day + group.rest_min + 1) % len(self.days), len(self.days))

                model += sum( [ self.X[group.name, d] for d in maxdays ] ) >= 1
                model += sum( [ self.X[group.name, d] for d in mindays ] ) <= 1
                
        # Each muscle group i such that i.after_rest == True must always be trained after a rest day
        for group in self.groups:
            for day in self.days:
                model += self.X[group.name, day] * group.after_rest <= self.Y[(day - 1) % len(self.days)]
                
        # Muscle groups combination preferences:
        # Each muscle group can only be trained with groups beloging to group.split_preference
        for group in self.groups:
            # For every other group with which the first one CANNOT be trained
            for other in self.groups - group.split_preference - set([group]):
                for day in self.days:
                    model += self.X[group.name, day] + self.X[other.name, day] <= 1

        # Objective function
        model += self.Z # we want to minimize the number of muscles trained per session
        self.model = model

    def _make_split(self):
        split = []
        for day in self.days:
            day_split = [ (self.X[group.name, day], group.name) for group in self.groups ]
            day_split = list(filter(lambda g : g[0].value() == 1, day_split))
            day_split = list(map(lambda g: g[1], day_split))
            split.append(day_split)
        return split

    def _empty_split(self):
        return [[]] * self.days

    def solve(self):
        # Solve the problem
        status = self.model.solve() 
        if status == 1:
            return self._make_split()
        else:
            return None
