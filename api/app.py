from flask import Flask, request
from solver import MuscleGroup, SplitScheduler
from flask_cors import CORS, cross_origin

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

    # TODO: parameterize preferences
    chest.set_split_preference([arms, delts])
    back.set_split_preference([arms, delts])
    legs.set_split_preference([])
    arms.set_split_preference([chest, back, delts])
    delts.set_split_preference([chest, back, arms])

    groups = set([chest, back, legs, arms, delts])
    scheduler = SplitScheduler(groups,
            int(args['days']),
            int(args['rest_days']),
            int(args['max_consecutive_work']),
            int(args['max_consecutive_rest']))

    return {'split': scheduler.solve()}

