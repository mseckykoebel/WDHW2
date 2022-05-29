from flask import Response, request
from flask_restful import Resource
from models import LikePost, db
import json
from tests.utils import get_authorized_user_ids

from views import can_view_post
# flask extended
import flask_jwt_extended


class PostLikesListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "like_post" based on the data posted in the body
        body = request.get_json()
        print(body)

        # try to cast to an int, and if it fails, error it out
        try:
            like_id = int(body.get("post_id"))
        except:
            return Response(
                json.dumps({"message": "post ID must be an integer!"}),
                mimetype="application/json",
                status=400,
            )

        # check and see if we're authorized to bookmark this post
        # and, check and see if this ID is valid (cannot be too big)
        print(f"Can the user view? {can_view_post(like_id, self.current_user)}")
        if not can_view_post(like_id, self.current_user):
            print("Cannot access this!")
            return Response(
                json.dumps({"message": "invalid post ID"}),
                mimetype="application/json",
                status=404,
            )

        try:
            # make the new bookmark
            new_like = LikePost(self.current_user.id, like_id)

            db.session.add(new_like)
            db.session.commit()

            return Response(
                json.dumps(new_like.to_dict()), mimetype="application/json", status=201
            )
        except:
            return Response(
                json.dumps({"message": "error posting"}),
                mimetype="application/json",
                status=400,
            )


class PostLikesDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # check if the ID is invalid
        if id > 999:
            return Response(
                json.dumps({"message": "id is invalid!"}),
                mimetype="application/json",
                status=404,
            )

        # see if we are authorized to edit this bookmark
        like_post = LikePost.query.get(id)
        print(f"This is the like post: {like_post}")
        user_ids = get_authorized_user_ids(self.current_user.id)
        if like_post.user_id not in user_ids:
            return Response(
                json.dumps({"message": "id is invalid!"}),
                mimetype="application/json",
                status=404,
            )

        # delete bookmark where "id"=id
        LikePost.query.filter_by(id=id).delete()
        db.session.commit()

        return Response(
            json.dumps(
                {"message": "liked post id={0} was successfully deleted".format(id)}
            ),
            mimetype="application/json",
            status=200,
        )


def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint,
        "/api/posts/likes",
        "/api/posts/likes/",
        resource_class_kwargs={"current_user": flask_jwt_extended.current_user},
    )

    api.add_resource(
        PostLikesDetailEndpoint,
        "/api/posts/likes/<int:id>",
        "/api/posts/likes/<int:id>/",
        resource_class_kwargs={"current_user": flask_jwt_extended.current_user},
    )
