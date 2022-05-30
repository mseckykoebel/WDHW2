from locale import currency
from flask import Response, request
from flask_restful import Resource
import json
from models import db, Comment, utils
from views import can_view_post, get_authorized_user_ids

import flask_jwt_extended

class CommentListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def post(self):
        """
        Create a new comment based on the data provided in the body
        """
        body = request.get_json()
        # check if the two main things are present
        if not body.get("text"):
            return Response(
                json.dumps({"message": "text is required!"}),
                mimetype="application/json",
                status=400,
            )
        if not body.get("post_id"):
            return Response(
                json.dumps({"message": "post_id is required!"}),
                mimetype="application/json",
                status=400,
            )

        # try to cast to a string, and if it fails, error it out
        try:
            post_id = int(body.get("post_id"))
        except:
            return Response(
                json.dumps({"message": "post ID must be an integer!"}),
                mimetype="application/json",
                status=400,
            )

        # check and see if we're authorized to comment on this post
        # and, if the post ID is too large
        if not can_view_post(post_id, self.current_user) or post_id > 999:
            return Response(
                json.dumps({"message": "invalid post ID!"}),
                mimetype="application/json",
                status=404,
            )

        # make the comment
        new_comment = Comment(
            text=body.get("text"),
            post_id=post_id,
            user_id=self.current_user.id,
        )

        print(f"This is the new comment: {new_comment}")

        # commit the comment
        db.session.add(new_comment)
        db.session.commit()

        return Response(
            json.dumps(new_comment.to_dict()), mimetype="application/json", status=201
        )


class CommentDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # delete "Comment" record where "id"=id
        comment = Comment.query.get(id)
        if not comment:
            return Response(
                json.dumps({"message": "id is invalid!"}),
                mimetype="application/json",
                status=404,
            )
        # try to cast to a string, and if it fails, error it out
        try:
            post_id = int(comment.post_id)
        except:
            return Response(
                json.dumps({"message": "post ID must be an integer!"}),
                mimetype="application/json",
                status=400,
            )

        # see if the current user is allowed to make changes
        user_ids = get_authorized_user_ids(self.current_user)
        if comment.user_id not in user_ids:
            return Response(
                json.dumps({"message": "id={0} is invalid!"}),
                mimetype="application/json",
                status=404,
            )

        # check and see if the post ID is too large
        if post_id > 999:
            return Response(
                json.dumps({"message": "invalid post ID!"}),
                mimetype="application/json",
                status=404,
            )

        # delete post where "id"=id
        Comment.query.filter_by(id=id).delete()
        db.session.commit()
        
        return Response(
            json.dumps(
                {"message": "comment id={0} was successfully deleted".format(id)}
            ),
            mimetype="application/json",
            status=200,
        )


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint,
        "/api/comments",
        "/api/comments/",
        resource_class_kwargs={"current_user": flask_jwt_extended.current_user},
    )
    api.add_resource(
        CommentDetailEndpoint,
        "/api/comments/<int:id>",
        "/api/comments/<int:id>/",
        resource_class_kwargs={"current_user": flask_jwt_extended.current_user},
    )
