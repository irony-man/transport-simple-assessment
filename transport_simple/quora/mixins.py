from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator


class AuthMixin:
    """Checks if the user is logged or not"""

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(AuthMixin, self).dispatch(  # noqa
            request, *args, **kwargs
        )
