from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status  # Ensure this is imported for status codes
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .models import Participant, ProgramCost, CrimeData
from .serializers import ParticipantSerializer, ProgramCostSerializer, CrimeDataSerializer
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication





class MetricsOverview(APIView):
    permission_classes = [AllowAny]  # Allow access to all users

    def get(self, request):
        # Fetch data
        participants = Participant.objects.all()
        program_costs = ProgramCost.objects.all()
        crime_data = CrimeData.objects.all()

        # Total participants
        total_participants = participants.count()
        employed_count = participants.filter(employed=True).count()
        reoffending_count = participants.filter(reoffended=True).count()
        sober_count = participants.filter(sobriety_status=True).count()

        # Economic contributions
        total_income = sum([p.income for p in participants])
        total_tax_contributions = sum([p.tax_contributions for p in participants])
        total_program_costs = sum([cost.cost for cost in program_costs])

        # Crime data
        total_crime_cost = sum([c.crime_cost for c in crime_data])
        total_crime_rate = sum([c.crime_rate for c in crime_data]) / crime_data.count() if crime_data.count() > 0 else 0

        # Metrics calculations
        reoffending_rate = (reoffending_count / total_participants) * 100 if total_participants > 0 else 0
        employment_rate = (employed_count / total_participants) * 100 if total_participants > 0 else 0
        sobriety_rate = (sober_count / total_participants) * 100 if total_participants > 0 else 0
        cost_per_participant = total_program_costs / total_participants if total_participants > 0 else 0

        # Return on Investment (ROI)
        roi = (total_income + total_tax_contributions - total_program_costs) / total_program_costs if total_program_costs > 0 else 0

        # Metrics per person
        average_income = total_income / employed_count if employed_count > 0 else 0
        average_tax_contribution = total_tax_contributions / employed_count if employed_count > 0 else 0

        # Community impact
        crime_rate_reduction = (total_crime_rate * 0.9)  # Assuming 10% reduction due to TN interventions
        cost_of_crime_reduction = total_crime_cost * 0.1  # Assuming 10% reduction

        # Family and social metrics
        dependents_helped = total_participants * 2  # Assuming each participant impacts 2 family members

        # Region-wise crime data
        region_crime_data = {}
        for region in set(c.region for c in crime_data):
            region_crimes = crime_data.filter(region=region)
            region_total_cost = sum([c.crime_cost for c in region_crimes])
            region_avg_rate = sum([c.crime_rate for c in region_crimes]) / region_crimes.count() if region_crimes.count() > 0 else 0
            region_crime_data[region] = {
                "total_crime_cost": region_total_cost,
                "average_crime_rate": region_avg_rate,
            }

        # Construct response
        response_data = {
            "total_participants": total_participants,
            "employment_rate": employment_rate,
            "reoffending_rate": reoffending_rate,
            "sobriety_rate": sobriety_rate,
            "total_income_generated": total_income,
            "total_tax_contributions": total_tax_contributions,
            "total_program_costs": total_program_costs,
            "average_income_per_person": average_income,
            "average_tax_contribution_per_person": average_tax_contribution,
            "roi": roi,
            "cost_per_participant": cost_per_participant,
            "crime_rate_reduction": crime_rate_reduction,
            "cost_of_crime_reduction": cost_of_crime_reduction,
            "total_crime_cost": total_crime_cost,
            "total_crime_rate": total_crime_rate,
            "dependents_helped": dependents_helped,
            "region_crime_data": region_crime_data,
        }

        return Response(response_data)


class TokenLoginView(APIView):
    """
    Handles login and returns a token for authenticated users.
    permission_classes = [AllowAny] 
    """
    permission_classes = [AllowAny] 
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class TokenLogoutView(APIView):
    """
    Handles logout by deleting the user's token.
    """
    def post(self, request):
        token = request.auth
        if token:
            token.delete()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid token or not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
    
# CRUD for Metrics
class ParticipantCRUDView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        participants = Participant.objects.all()
        serializer = ParticipantSerializer(participants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ParticipantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            participant = Participant.objects.get(pk=pk)
        except Participant.DoesNotExist:
            return Response({"error": "Participant not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ParticipantSerializer(participant, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            participant = Participant.objects.get(pk=pk)
            participant.delete()
            return Response({"message": "Participant deleted successfully"}, status=status.HTTP_200_OK)
        except Participant.DoesNotExist:
            return Response({"error": "Participant not found"}, status=status.HTTP_404_NOT_FOUND)


class ProgramCostCRUDView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        program_costs = ProgramCost.objects.all()
        serializer = ProgramCostSerializer(program_costs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ProgramCostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            program_cost = ProgramCost.objects.get(pk=pk)
        except ProgramCost.DoesNotExist:
            return Response({"error": "Program cost not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProgramCostSerializer(program_cost, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            program_cost = ProgramCost.objects.get(pk=pk)
            program_cost.delete()
            return Response({"message": "Program cost deleted successfully"}, status=status.HTTP_200_OK)
        except ProgramCost.DoesNotExist:
            return Response({"error": "Program cost not found"}, status=status.HTTP_404_NOT_FOUND)


class CrimeDataCRUDView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        crime_data = CrimeData.objects.all()
        serializer = CrimeDataSerializer(crime_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CrimeDataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            crime_data = CrimeData.objects.get(pk=pk)
        except CrimeData.DoesNotExist:
            return Response({"error": "Crime data not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CrimeDataSerializer(crime_data, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            crime_data = CrimeData.objects.get(pk=pk)
            crime_data.delete()
            return Response({"message": "Crime data deleted successfully"}, status=status.HTTP_200_OK)
        except CrimeData.DoesNotExist:
            return Response({"error": "Crime data not found"}, status=status.HTTP_404_NOT_FOUND)
