
import {
  getRequest,
  getUrl,
  postRequest,
  patchRequest,
  deleteRequest
} from "./network";

export default {

  async listQuestion(query) {
    const url = getUrl("question");
    return await getRequest(url, query);
  },

  async getQuestion(uid) {
    const url = getUrl(`question/${uid}`);
    return await getRequest(url);
  },

  async createQuestion(formData) {
    const url = getUrl("question");
    return await postRequest(url, formData);
  },

  async updateQuestion({uid, formData}) {
    const url = getUrl(`question/${uid}`);
    return await patchRequest(url, formData);
  },

  async deleteQuestion(uid) {
    const url = getUrl(`question/${uid}`);
    return await deleteRequest(url);
  },


  async listAnswer(query) {
    const url = getUrl("answer");
    return await getRequest(url, query);
  },

  async getAnswer(uid) {
    const url = getUrl(`answer/${uid}`);
    return await getRequest(url);
  },

  async createAnswer(formData) {
    const url = getUrl("answer");
    return await postRequest(url, formData);
  },

  async updateAnswer({uid, formData}) {
    const url = getUrl(`answer/${uid}`);
    return await patchRequest(url, formData);
  },

  async deleteAnswer(uid) {
    const url = getUrl(`answer/${uid}`);
    return await deleteRequest(url);
  },

};
