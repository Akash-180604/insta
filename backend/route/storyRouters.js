const express = require("express");
const isAuth = require("../middleWire/isAuth");
const upload = require("../middleWire/multer");
const { getAllStory, uploadStory, viewStory, getStory, userStory } = require("../controllers/storyControllers");
const storyRouter = express.Router();

storyRouter.get("/getAllStory",isAuth,getAllStory);
storyRouter.get("/userStory",isAuth,userStory);
storyRouter.post("/upload",isAuth,upload.single('media'),uploadStory);
storyRouter.get("/viewStory/:storyId",isAuth,viewStory);
storyRouter.get("/getStory/:userName",isAuth,getStory);



module.exports = storyRouter;