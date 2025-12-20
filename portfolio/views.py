from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail
from django.contrib import messages
from .models import Skill, Project, Achievement, ContactMessage

def home(request):
    skills = list(Skill.objects.all())
    # Projects logic moved to projects view

    # Pre-render Skills HTML to avoid Template Engine ghosts
    skills_html_parts = []
    for skill in skills:
        # Determine Icon HTML
        if skill.image:
             icon_html = f'<img src="{skill.image.url}" alt="{skill.name}" class="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity">'
        else:
             # Safe slice
             first_letter = skill.name[0] if skill.name else "?"
             icon_html = f'<span class="font-mono font-bold text-gray-500 group-hover:text-white">{first_letter}</span>'

        card = f"""
        <div class="group relative p-6 bg-black/40 hover:bg-white/[0.08] transition-all duration-300 flex flex-col justify-between h-48 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] rounded-2xl">
             <!-- Icon & Header -->
            <div class="flex items-start justify-between w-full">
                <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:text-white transition-colors duration-300 border border-white/10 group-hover:border-white/30 shadow-inner">
                    {icon_html}
                </div>
                <!-- Dynamic Trend Icon -->
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
            </div>
            
            <!-- Details -->
            <div class="w-full mt-auto">
                <h3 class="text-sm font-bold text-gray-300 group-hover:text-white mb-3 uppercase tracking-wider transition-colors">{skill.name}</h3>
                <div class="w-full bg-white/5 h-0.5 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-blue-500 to-white w-0 group-hover:w-full transition-all duration-1000 ease-out origin-left" style="width: {skill.proficiency}%"></div>
                </div>
                <div class="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span class="text-xs text-blue-400 font-mono">Proficiency</span>
                    <span class="text-xs text-white font-mono">{skill.proficiency}%</span>
                </div>
            </div>
        </div>
        """
        skills_html_parts.append(card)
    
    skills_html = "".join(skills_html_parts)
    
    return render(request, 'portfolio/home.html', {
        'skills': skills,
        'skills_html': skills_html,
    })

def gallery(request):
    achievements = Achievement.objects.all()
    return render(request, 'portfolio/gallery.html', {'achievements': achievements})

def projects(request):
    projects_list = list(Project.objects.all())
    for project in projects_list:
        project.tag_html = ""
        if project.tech_stack:
            tags = [t.strip() for t in project.tech_stack.split(',') if t.strip()]
            html_parts = []
            for tag in tags:
                html_parts.append(f'<span class="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 font-mono">{tag}</span>')
            project.tag_html = "".join(html_parts)
    return render(request, 'portfolio/projects.html', {'projects': projects_list})

def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        message_text = request.POST.get('message')
        
        # Save to database first (this always works)
        contact_message = ContactMessage.objects.create(
            name=name,
            email=email,
            message=message_text
        )
        
        # Try to send email (this might fail)
        try:
            send_mail(
                f'Portfolio Contact from {name}',
                f'Message from {name} <{email}>:\n\n{message_text}',
                'darshjilka.spare@gmail.com',  # From email (use your email)
                ['darshjilka.spare@gmail.com'],  # To email
                fail_silently=False,
            )
            messages.success(request, 'Message sent successfully! I will get back to you soon.')
        except Exception as e:
            # Log the error but still show a message to the user
            print(f"Email error: {str(e)}")
            # Message is already saved to database, so it's not lost
            messages.success(request, 'Message received! I will get back to you soon.')
        
        return redirect('home')
    return redirect('home')

def project_detail(request, pk):
    project = get_object_or_404(Project, pk=pk)
    tags = [t.strip() for t in project.tech_stack.split(',')] if project.tech_stack else []
    return render(request, 'portfolio/project_detail.html', {'project': project, 'tags': tags})

def about(request):
    reviews = [
        {
            "name": "Aditya Sharma",
            "text": "Darsh transformed our manual workflows into a seamless automated system. Efficiency increased by 300% in just two weeks.",
            "rating": 5
        },
        {
            "name": "Rohan Mehta",
            "text": "The ROI was immediate. The revenue tracking dashboard he built gave us insights we didn't know we needed. Highly recommended.",
            "rating": 5
        },
        {
            "name": "Priya Patel",
            "text": "Exceptional code quality and attention to detail. He delivered the project ahead of schedule and the documentation was perfect.",
            "rating": 5
        },
        {
            "name": "Arjun Singh",
            "text": "Rarely do you find a developer who understands design this well. The final product looked even better than our mockups.",
            "rating": 5
        }
    ]
    return render(request, 'portfolio/about.html', {'reviews': reviews})
