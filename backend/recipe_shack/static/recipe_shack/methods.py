from django.http import JsonResponse

def create_response(msg="", data=None):
    response = {"status": not bool(len(msg)), "error_message": msg}
    if(data != None):
        response["data"] = data
    return JsonResponse(response)
