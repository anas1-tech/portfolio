from django.contrib import admin

from .models import ContactMessage, Course, Experience, Project, SiteSettings, Skill


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at", "is_read")
    list_filter = ("is_read",)
    readonly_fields = ("name", "email", "message", "created_at")


admin.site.register(SiteSettings)
admin.site.register(Experience)
admin.site.register(Skill)
admin.site.register(Course)
admin.site.register(Project)
