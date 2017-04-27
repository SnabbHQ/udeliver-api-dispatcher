import * as express from 'express';
import { Post } from "../../models/post/model";
import { Author } from "../../models/author/model";

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
    .get((request, response) => {
        const posts = Post.find({}).populate("author").exec();
        response.json(posts);
    });

export default router;