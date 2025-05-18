from django.shortcuts import render
from rest_framework import viewsets
from .models import Lead
from .serializers import LeadSerializer





# Create your views here.
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
   
    
    def get_queryset(self):
        return self.queryset.filter(created_by=self.request.user)
      
    