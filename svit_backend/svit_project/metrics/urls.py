from django.urls import path
from .views import MetricsOverview
from .views import TokenLoginView, TokenLogoutView
from .views import ParticipantCRUDView, ProgramCostCRUDView, CrimeDataCRUDView



urlpatterns = [
    path('metrics/', MetricsOverview.as_view(), name='metrics-overview'),
    path('token-login/', TokenLoginView.as_view(), name='token_login'),
    path('token-logout/', TokenLogoutView.as_view(), name='token_logout'),
    path('participants/', ParticipantCRUDView.as_view(), name='participant_list'),
    path('participants/<int:pk>/', ParticipantCRUDView.as_view(), name='participant_detail'),
    path('program-costs/', ProgramCostCRUDView.as_view(), name='program_cost_list'),
    path('program-costs/<int:pk>/', ProgramCostCRUDView.as_view(), name='program_cost_detail'),
    path('crime-data/', CrimeDataCRUDView.as_view(), name='crime_data_list'),
    path('crime-data/<int:pk>/', CrimeDataCRUDView.as_view(), name='crime_data_detail'),
]
