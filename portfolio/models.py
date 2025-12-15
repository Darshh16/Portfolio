from django.db import models

class Skill(models.Model):
    name = models.CharField(max_length=100)
    icon_class = models.CharField(max_length=100, help_text="FontAwesome or similar icon class", blank=True)
    image = models.ImageField(upload_to='skills/', blank=True, null=True)
    proficiency = models.IntegerField(default=0, help_text="Percentage 0-100")

    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/')
    github_link = models.URLField(blank=True)
    live_link = models.URLField(blank=True)
    tech_stack = models.CharField(max_length=200, help_text="Comma separated tags")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Achievement(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='achievements/')
    date = models.DateField()

    def __str__(self):
        return self.title
