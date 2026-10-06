from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler


def api_exception_handler(exc: Exception, context: dict) -> Response | None:
    response = exception_handler(exc, context)
    if response is None:
        return None

    detail = response.data
    if isinstance(exc, APIException) and isinstance(detail, dict) and "detail" in detail:
        message = str(detail["detail"])
        errors = {}
    elif isinstance(detail, dict):
        message = "Please correct the errors below."
        errors = detail
    else:
        message = str(detail)
        errors = {}
    response.data = {"success": False, "message": message, "errors": errors}
    return response
