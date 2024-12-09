from django.contrib import admin
from .models import Participant, ProgramCost, CrimeData

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('name', 'date_joined', 'employed', 'income', 'tax_contributions', 'reoffended', 'sobriety_status')
    list_filter = ('employed', 'reoffended', 'sobriety_status', 'date_joined')
    search_fields = ('name',)
    ordering = ('date_joined',)
    list_editable = ('employed', 'reoffended', 'sobriety_status')

@admin.register(ProgramCost)
class ProgramCostAdmin(admin.ModelAdmin):
    list_display = ('year', 'cost')
    search_fields = ('year',)
    ordering = ('year',)
    list_editable = ('cost',)

@admin.register(CrimeData)
class CrimeDataAdmin(admin.ModelAdmin):
    list_display = ('region', 'crime_rate', 'crime_cost')
    list_filter = ('region',)
    search_fields = ('region',)
    ordering = ('region',)
    list_editable = ('crime_rate', 'crime_cost')
