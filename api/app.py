from flask import Flask, request
from solver import MuscleGroup, SplitScheduler
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)

@app.route('/solve', methods=['POST'])
@cross_origin()
def solve_api():
    args = request.form
    chest = MuscleGroup('CHEST', 
            int(args['chest_rest_min']),
            int(args['chest_rest_max']),
            int(args['chest_rotations']),
            args['chest_after_rest'].lower() == 'true')
    back = MuscleGroup('BACK', 
            int(args['back_rest_min']),
            int(args['back_rest_max']),
            int(args['back_rotations']),
            args['back_after_rest'].lower() == 'true')
    legs = MuscleGroup('LEGS', 
            int(args['legs_rest_min']),
            int(args['legs_rest_max']),
            int(args['legs_rotations']),
            args['legs_after_rest'].lower() == 'true')
    arms = MuscleGroup('ARMS', 
            int(args['arms_rest_min']),
            int(args['arms_rest_max']),
            int(args['arms_rotations']),
            args['arms_after_rest'].lower() == 'true')
    delts = MuscleGroup('DELTS', 
            int(args['delts_rest_min']),
            int(args['delts_rest_max']),
            int(args['delts_rotations']),
            args['delts_after_rest'].lower() == 'true')

    groups_map = {
            'chest': chest,
            'back': back,
            'legs': legs,
            'arms': arms,
            'delts': delts
            }

    preferences = {
            'chest': [],
            'back': [],
            'legs': [],
            'arms': [],
            'delts': []
            }

    for group in ['chest', 'back', 'legs', 'arms', 'delts']:
        for other in ['chest', 'back', 'legs', 'arms', 'delts']:
            if group == other: continue
            p = '{}_preference_{}'.format(group, other)
            if p in args.keys() and args[p].lower() == 'true':
                preferences[group].append(groups_map[other])

    chest.set_split_preference(preferences['chest'])
    back.set_split_preference(preferences['back'])
    legs.set_split_preference(preferences['legs'])
    arms.set_split_preference(preferences['arms'])
    delts.set_split_preference(preferences['delts'])

    rest = json.loads(args['rest'])

    choices = json.loads(args['choices'])
    # choices = [[g for g in choice] for choice in choices]
    print(choices)
    print(rest)

    groups = set([chest, back, legs, arms, delts])
    scheduler = SplitScheduler(groups,
            int(args['days']),
            int(args['rest_days']),
            rest,
            choices,
            int(args['max_consecutive_work']),
            int(args['max_consecutive_rest']))

    return {'split': scheduler.solve()}

