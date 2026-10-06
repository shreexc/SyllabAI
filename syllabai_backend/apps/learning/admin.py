from django.contrib import admin

from .models import LearningChunk, LearningResource, PreparationRequest


class LearningChunkInline(admin.TabularInline):
    model = LearningChunk
    extra = 0
    can_delete = False
    readonly_fields = ("resource_version", "index", "page_number", "content_hash")
    fields = ("resource_version", "index", "page_number", "content_hash")


@admin.register(LearningResource)
class LearningResourceAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "resource_type", "source_type", "status", "file_size", "created_at")
    list_filter = ("resource_type", "source_type", "status", "created_at")
    search_fields = ("title", "owner__email", "description")
    readonly_fields = ("id", "owner", "mime_type", "file_size", "resource_version", "created_at", "updated_at")
    inlines = (LearningChunkInline,)


@admin.register(PreparationRequest)
class PreparationRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "resource", "preparation_type", "status", "created_at", "completed_at")
    list_filter = ("preparation_type", "status", "created_at")
    search_fields = ("user__email", "resource__title", "id")
    readonly_fields = ("id", "user", "resource", "preparation_type", "options", "result", "error_message", "created_at", "completed_at")
