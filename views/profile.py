from flask import Response, request
from flask_restful import Resource
import json

from models import User

import flask_jwt_extended


def get_path():
    return request.host_url + "api/posts/"


class ProfileDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def get(self):
        """
        Get information on the currently logged in user
        """
        user = User.query.filter_by(id=self.current_user.id).limit(1).all().pop()
        return Response(
            json.dumps(user.to_dict()), mimetype="application/json", status=200
        )


def initialize_routes(api):
    api.add_resource(
        ProfileDetailEndpoint,
        "/api/profile",
        "/api/profile/",
        resource_class_kwargs={"current_user": flask_jwt_extended.current_user},
    )
