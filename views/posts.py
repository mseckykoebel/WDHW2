from flask import Response, request
from flask_restful import Resource
from models import Post, db, Following
from views import get_authorized_user_ids

import json


def get_path():
    return request.host_url + "api/posts/"


class PostListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):  # HTTP GET
        args = request.args
        print(args)
        # Goal: limit to only user #12 (current_user)'s network
        #   - oneself
        #   - ppl #12 are following

        # 1. Query the following table to get the user_ids that #12 is following:
        user_ids_tuples = (
            db.session.query(Following.following_id)
            .filter(Following.user_id == self.current_user.id)
            .order_by(Following.following_id)
            .all()
        )
        print(user_ids_tuples)
        user_ids = [id for (id,) in user_ids_tuples]
        print(user_ids)
        user_ids.append(self.current_user.id)

        # alternative method
        # user_ids = get_authorized_user_ids(self.current_user)
        try:
            limit = int(args.get("limit") or 20)  # 20 is the default
        except:
            return Response(
                json.dumps(
                    {"message": "could not convert to an int - invalid limit parameter"}
                ),
                mimetype="application/json",
                status=400,
            )
        if limit > 50:
            return Response(
                json.dumps({"message": "too large - invalid limit parameter"}),
                mimetype="application/json",
                status=400,
            )
        # posts = Post.query.limit(limit).all()
        posts = Post.query.filter(Post.user_id.in_(user_ids)).limit(limit).all()
        posts_json = [post.to_dict() for post in posts]
        print(posts_json)
        return Response(json.dumps(posts_json), mimetype="application/json", status=200)

    def post(self):  # HTTP POST
        # create a new post based on the data posted in the body
        body = request.get_json()

        if not body.get("image_url"):
            return Response(
                json.dumps({"message": "image_url is required!"}),
                mimetype="application/json",
                status=400,
            )

        print(body)

        new_post = Post(
            image_url=body.get("image_url"),
            user_id=self.current_user.id,
            caption=body.get("caption"),
            alt_text=body.get("alt_text"),
        )

        # add and then commit the changes to the database
        db.session.add(new_post)
        db.session.commit()

        return Response(
            json.dumps(new_post.to_dict()), mimetype="application/json", status=201
        )


class PostDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    # update the post based on this
    def patch(self, id):
        # update post based on the data posted in the body
        body = request.get_json()
        print(body)

        # get the post from the db
        post = Post.query.get(id)
        if not post:
            return Response(
                json.dumps({"message": "id={0} is invalid!"}),
                mimetype="application/json",
                status=404,
            )
        # check to see if we are one of the authorized users to do this
        user_ids = get_authorized_user_ids(self.current_user)
        if post.user_id not in user_ids:
            return Response(
                json.dumps({"message": "id={0} is invalid!"}),
                mimetype="application/json",
                status=404,
            )
        # set the new value
        if body.get("image_url"):
            post.image_url = body.get("image_url")
        if body.get("caption"):
            post.caption = body.get("caption")
        if body.get("alt_text"):
            post.alt_text = body.get("alt_text")
        # commit the post back to the db
        db.session.commit()
        # and send back a 200
        return Response(
            json.dumps(post.to_dict()), mimetype="application/json", status=200
        )

    def delete(self, id):
        # get the post from the db
        post = Post.query.get(id)
        if not post:
            return Response(
                json.dumps({"message": "id={0} is invalid!"}),
                mimetype="application/json",
                status=404,
            )
        # check to see if we are one of the authorized users to do this
        user_ids = get_authorized_user_ids(self.current_user)
        if post.user_id not in user_ids:
            return Response(
                json.dumps({"message": "id={0} is invalid!"}),
                mimetype="application/json",
                status=404,
            )
        # delete post where "id"=id
        Post.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(
            json.dumps({"message": "post id={0} was successfully deleted".format(id)}),
            mimetype="application/json",
            status=200,
        )

    def get(self, id):
        # get the post based on the id
        if not Post.query.get(id):
            return Response(
                json.dumps({"message": f"id {id} is invalid"}),
                mimetype="application/json",
                status=404,
            )
        # users we are connected to
        post = Post.query.get(id)
        user_ids = get_authorized_user_ids(self.current_user)
        if post.user_id not in user_ids:
            return Response(
                json.dumps({"message": f"id {id} is invalid"}),
                mimetype="application/json",
                status=404,
            )
        # response from the server
        return Response(
            json.dumps(post.to_dict()), mimetype="application/json", status=200
        )


def initialize_routes(api):
    api.add_resource(
        PostListEndpoint,
        "/api/posts",
        "/api/posts/",
        resource_class_kwargs={"current_user": api.app.current_user},
    )
    api.add_resource(
        PostDetailEndpoint,
        "/api/posts/<int:id>",
        "/api/posts/<int:id>/",
        resource_class_kwargs={"current_user": api.app.current_user},
    )
