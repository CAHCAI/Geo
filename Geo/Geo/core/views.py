"""

example of a view

def example_view(request):
    return render(request, 'example.html', {})

"""

from django.shortcuts import render

def index(request):
    return render(request,'frontend.html'),

