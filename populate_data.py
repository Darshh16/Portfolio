import os
import django
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from portfolio.models import Skill, Project, Achievement

def populate():
    # Skills
    skills_data = [
        {'name': 'Python', 'proficiency': 90},
        {'name': 'Django', 'proficiency': 85},
        {'name': 'JavaScript', 'proficiency': 80},
        {'name': 'React', 'proficiency': 75},
        {'name': 'Data Science', 'proficiency': 70},
        {'name': 'AI Automation', 'proficiency': 65},
        {'name': 'Tailwind CSS', 'proficiency': 90},
        {'name': 'PostgreSQL', 'proficiency': 80},
    ]

    for data in skills_data:
        Skill.objects.get_or_create(name=data['name'], defaults={'proficiency': data['proficiency']})
    print("Skills populated.")

    # Projects
    projects_data = [
        {
            'title': 'AI Agentic Workflow Engine',
            'description': 'A scalable engine for orchestrating multiple AI agents to perform complex tasks autonomously. Built with Python and LangChain.',
            'tech_stack': 'Python, LangChain, OpenAI, Redis',
            'github_link': 'https://github.com/darshjilka/ai-engine',
            'live_link': '#'
        },
        {
            'title': 'E-Commerce Analytics Dashboard',
            'description': 'Real-time analytics dashboard for e-commerce platforms using Django and React. Visualizes sales trends and user behavior.',
            'tech_stack': 'Django, React, Chart.js, PostgreSQL',
            'github_link': 'https://github.com/darshjilka/analytics-dash',
            'live_link': '#'
        },
        {
            'title': 'Smart Home Automation Hub',
            'description': 'IoT-based home automation system allowing control of devices via a web interface. Integrated with voice assistants.',
            'tech_stack': 'IoT, Node.js, MQTT, React',
            'github_link': 'https://github.com/darshjilka/smart-home',
            'live_link': '#'
        }
    ]

    for data in projects_data:
        Project.objects.get_or_create(
            title=data['title'],
            defaults={
                'description': data['description'],
                'tech_stack': data['tech_stack'],
                'github_link': data['github_link'],
                'live_link': data['live_link']
            }
        )
    print("Projects populated.")

    # Achievements
    achievements_data = [
        {
            'title': 'Hackathon Winner 2024',
            'description': 'First place in the National AI Hackathon for building an innovative healthcare solution.',
            'date': '2024-03-15'
        },
        {
            'title': 'Open Source Contributor',
            'description': 'Active contributor to major open-source Django packages.',
            'date': '2023-11-20'
        },
        {
            'title': 'Certified Cloud Practitioner',
            'description': 'Achieved AWS Certified Cloud Practitioner certification.',
            'date': '2023-08-10'
        }
    ]

    for data in achievements_data:
        Achievement.objects.get_or_create(
            title=data['title'],
            defaults={
                'description': data['description'],
                'date': data['date']
            }
        )
    print("Achievements populated.")

if __name__ == '__main__':
    populate()
