from django.db import models


class SiteSettings(models.Model):
    """Singleton row: hero, about and contact details."""

    hero_title_ar = models.CharField(max_length=120, blank=True)
    hero_title_en = models.CharField(max_length=120, blank=True)
    hero_subtitle_ar = models.CharField(max_length=200, blank=True)
    hero_subtitle_en = models.CharField(max_length=200, blank=True)
    about_text_ar = models.TextField(blank=True)
    about_text_en = models.TextField(blank=True)
    address_ar = models.CharField(max_length=200, blank=True)
    address_en = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True)
    whatsapp = models.CharField(max_length=30, blank=True)
    twitter = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    github = models.URLField(blank=True)

    class Meta:
        verbose_name_plural = "Site settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Site settings"


class Experience(models.Model):
    class Kind(models.TextChoices):
        EXPERIENCE = "exp", "Experience"
        EDUCATION = "edu", "Education"

    type = models.CharField(max_length=3, choices=Kind.choices, default=Kind.EXPERIENCE)
    title_ar = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200, blank=True)
    place_ar = models.CharField(max_length=200, blank=True)
    place_en = models.CharField(max_length=200, blank=True)
    date_ar = models.CharField(max_length=100, blank=True)
    date_en = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return self.title_en or self.title_ar


class Skill(models.Model):
    name_ar = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name_en or self.name_ar


class Course(models.Model):
    name_ar = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200, blank=True)
    date_ar = models.CharField(max_length=100, blank=True)
    date_en = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name_en or self.name_ar


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField(max_length=3000)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} <{self.email}>"


class Project(models.Model):
    title_ar = models.CharField(max_length=200)
    title_en = models.CharField(max_length=200, blank=True)
    desc_ar = models.TextField(blank=True)
    desc_en = models.TextField(blank=True)
    techs = models.JSONField(default=list, blank=True)
    image = models.ImageField(upload_to="projects/", blank=True)
    url = models.URLField(blank=True)
    repo = models.URLField(blank=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return self.title_en or self.title_ar
