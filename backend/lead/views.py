from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Lead
from .serializers import LeadSerializer





# Create your views here.
class LeadViewSet(viewsets.ModelViewSet):
    
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]
   
    
    def get_queryset(self):
        return self.queryset.filter(created_by=self.request.user)
      
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    