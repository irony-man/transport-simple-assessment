import {deleteRequest, getRequest, getUrl, patchRequest, postRequest } from "./network.js";
import GeneratedActions from './actions.gen.js';

export default {
  async getChoices() {
    const url = getUrl("user/choices");
    return await getRequest(url);
  },
  async getUser() {
    const url = getUrl("user/me");
    return await getRequest(url);
  },
  async createUser(formData) {
    const url = getUrl(`user`);
    return await postRequest(url, formData);
  },
  async updateUser({uid, formData}) {
    const url = getUrl(`user/${uid}`);
    return await patchRequest(url, formData);
  },
  async logoutUser() {
    const url = "logout/";
    return await getRequest(url);
  },
  async loginUser(formData) {
    const url = getUrl("login");
    return await postRequest(url, formData);
  },

  async upvoteAnswer(uid) {
    const url = getUrl(`answer/${uid}/upvote`);
    return await postRequest(url);
  },

  async downvoteAnswer(uid) {
    const url = getUrl(`answer/${uid}/downvote`);
    return await postRequest(url);
  },

  async deleteReactionAnswer(uid) {
    const url = getUrl(`answer/${uid}/remove_reaction`);
    return await deleteRequest(url);
  },

  ...GeneratedActions,
};
