"""
TEMPORARY SCRIPT - DELETE AFTER USE!
This script resets the admin password when the server starts.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User

def reset_admin_password():
    try:
        # Find the admin user
        admin = User.objects.filter(is_superuser=True).first()
        if admin:
            # SET YOUR NEW PASSWORD HERE
            new_password = "darsh12345"  # <-- CHANGE THIS TO YOUR DESIRED PASSWORD
            admin.set_password(new_password)
            admin.save()
            print(f"✅ Password reset for user: {admin.username}")
            print(f"   New password: {new_password}")
        else:
            print("❌ No superuser found!")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    reset_admin_password()
