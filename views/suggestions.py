from flask import Response, request
from flask_restful import Resource
from models import User, Following, db
from views import get_authorized_user_ids
from random import sample
import json

import flask_jwt_extended


class SuggestionsListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def get(self):
        """
        Suggestions for seven users that we're not following.
        Hard-coded limit to seven
        """

        user_ids = get_authorized_user_ids(self.current_user)

        # get all of the information from a list of userIds
        users = User.query.filter(~User.id.in_(user_ids)).limit(7).all()
        print(f"users: {users[0].to_dict()}")
        users_json = [user.to_dict() for user in users]

        return Response(json.dumps(users_json), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        SuggestionsListEndpoint,
        "/api/suggestions",
        "/api/suggestions/",
        resource_class_kwargs={"current_user": flask_jwt_extended.current_user},
    )
