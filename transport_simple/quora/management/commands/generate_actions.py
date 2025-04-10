# App Imports
from django.conf import settings
from django.core.management import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **options):
        template = """
  async list%(apiTitle)s(query) {
    const url = getUrl("%(name)s");
    return await getRequest(url, query);
  },

  async get%(apiTitle)s(uid) {
    const url = getUrl(`%(name)s/${uid}`);
    return await getRequest(url);
  },

  async create%(apiTitle)s(formData) {
    const url = getUrl("%(name)s");
    return await postRequest(url, formData);
  },

  async update%(apiTitle)s({uid, formData}) {
    const url = getUrl(`%(name)s/${uid}`);
    return await patchRequest(url, formData);
  },

  async delete%(apiTitle)s(uid) {
    const url = getUrl(`%(name)s/${uid}`);
    return await deleteRequest(url);
  },
"""
        result = []
        actions = [
            "question",
            "answer",
        ]
        for name in actions:
            title = name.replace("-", " ").title().replace(" ", "")
            fmt = template % {"name": name, "apiTitle": title}
            result.append(fmt)
        functions = "\n  ".join(result)
        file_template = (
            """
import {
  getRequest,
  getUrl,
  postRequest,
  patchRequest,
  deleteRequest
} from "./network";

export default {
    %s
};
"""
            % functions
        )
        path = (
            settings.BASE_DIR
            / "quora"
            / "static_dev"
            / "quora"
            / "src"
            / "apis"
            / "actions.gen.js"
        )

        with open(path, "w") as fp:
            fp.write(file_template)
            fp.flush()
