from rest_framework.response import Response


def success_response(message: str, data: dict | None = None, status: int = 200) -> Response:
    return Response({"success": True, "message": message, "data": data or {}}, status=status)
