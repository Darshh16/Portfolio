from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.contrib import messages
from .models import Skill, Project, Achievement

def home(request):
    skills = Skill.objects.all()
    projects = list(Project.objects.all()) # Convert to list to modify attributes
    for project in projects:
        project.tag_html = ""
        if project.tech_stack:
            tags = [t.strip() for t in project.tech_stack.split(',') if t.strip()]
            html_parts = []
            for tag in tags:
                html_parts.append(f'<span class="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 font-mono">{tag}</span>')
            project.tag_html = "".join(html_parts)

    # Pre-render Skills HTML to avoid Template Engine ghosts
    skills_html_parts = []
    for skill in skills:
        # Determine Icon HTML
        if skill.image:
             icon_html = f'<img src="{skill.image.url}" alt="{skill.name}" class="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity">'
        else:
             # Safe slice
             first_letter = skill.name[0] if skill.name else "?"
             icon_html = f'<span class="font-mono font-bold text-gray-400 group-hover:text-indigo-300">{first_letter}</span>'

        card = f"""
        <div class="group relative p-8 bg-black/40 hover:bg-white/[0.05] transition-all duration-300">
            <div class="flex flex-col h-full justify-between items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors duration-300 border border-white/5 group-hover:border-indigo-500/30">
                    {icon_html}
                </div>
                <div class="w-full">
                    <h3 class="text-lg font-bold text-gray-200 group-hover:text-white mb-2 transition-colors">{skill.name}</h3>
                    <div class="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-0 group-hover:w-full transition-all duration-700 ease-out origin-left" style="width: {skill.proficiency}%"></div>
                    </div>
                </div>
            </div>
        </div>
        """
        skills_html_parts.append(card)
    
    skills_html = "".join(skills_html_parts)
    
    achievements = Achievement.objects.all()
    return render(request, 'portfolio/home.html', {
        'skills': skills,
        'projects': projects,
        'achievements': achievements,
        'skills_html': skills_html,
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
