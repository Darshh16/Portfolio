from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.contrib import messages
from .models import Skill, Project, Achievement

def home(request):
    skills = Skill.objects.all()
    projects = Project.objects.all()
    achievements = Achievement.objects.all()
    return render(request, 'portfolio/home.html', {
        'skills': skills,
        'projects': projects,
        'achievements': achievements
    })

def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')
        
        # Send Email
        send_mail(
            f'Portfolio Contact from {name}',
            f'Message from {name} <{email}>:\n\n{message}',
            email, # From email (using user's email as from for simplicity in console/smtp)
            ['darshjilka.spare@gmail.com'], # To email
            fail_silently=False,
        )
        messages.success(request, 'Message sent successfully!')
        return redirect('home')
    return redirect('home')
