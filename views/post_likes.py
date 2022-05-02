from flask import Response, request
from flask_restful import Resource
from models import LikePost, db
import json

from views import can_view_post


class PostLikesListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

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

        # check to see if this bookmark has been catalogued in the past
        # this is not working as of now
        like_exists = LikePost.query.get(like_id)
        print(f"Bookmark exists: {like_exists}")
        if like_exists is not None:
            return Response(
                json.dumps(
                    {"message": "This post has already been bookmarked: rejected"}
                ),
                mimetype="application/json",
                status=400,
            )

        if like_id > 999:
            return Response(
                json.dumps({"message": "invalid post ID"}),
                mimetype="application/json",
                status=404,
            )

        # make the new bookmark
        new_like = LikePost(user_id=self.current_user.id, post_id=like_id)

        db.session.add(new_like)
        db.session.commit()

        return Response(
            json.dumps(new_like.to_dict()), mimetype="application/json", status=201
        )


class PostLikesDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def delete(self, id):
        # delete "like_post" where "id"=id
        print(id)
        return Response(json.dumps({}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint,
        "/api/posts/likes",
        "/api/posts/likes/",
        resource_class_kwargs={"current_user": api.app.current_user},
    )

    api.add_resource(
        PostLikesDetailEndpoint,
        "/api/posts/likes/<int:id>",
        "/api/posts/likes/<int:id>/",
        resource_class_kwargs={"current_user": api.app.current_user},
    )
