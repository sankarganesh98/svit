from rest_framework import serializers
from .models import Participant, ProgramCost, CrimeData


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'

class ProgramCostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramCost
        fields = '__all__'

class CrimeDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrimeData
        fields = '__all__'