from django.db import models
from django.contrib.auth.models import User


class Lead(models.Model):


    NEW = 'new'
    CONTACTED = 'contacted'
    CONTACT_IN_PROGRESS = 'inprogress'
    LOST = 'lost'
    WON = 'won'
    CHOICES_STATUS = [
        (NEW, 'New'),
        (CONTACTED, 'Contacted'),
        (CONTACT_IN_PROGRESS, 'In Progress'),
        (LOST, 'Lost'),
        (WON, 'Won'),
    ]
    
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'
    
    CHOICES_PRIORITY = [
        (LOW, 'Low'),
        (MEDIUM, 'Medium'),
        (HIGH, 'High'),
    ]
    
    
    company = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255 , default='unknown')
    email = models.EmailField(max_length=255)
    phone = models.CharField(max_length=255)
    website = models.CharField(max_length=255, blank=True, null=True)
    confidence = models.IntegerField(blank=True, null=True)
    estimated_value = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=25, choices=CHOICES_STATUS, default=NEW)
    priority = models.CharField(max_length=255, choices=CHOICES_PRIORITY, default=MEDIUM)
  #  assigned_to = models.ForeignKey(User, related_name='assignedleads', on_delete=models.SET_NULL, blank=True, null=True)
    created_by = models.ForeignKey(User, related_name='leads', on_delete=models.CASCADE) #when user is deleted, all leads created by that user are deleted
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    
    
    
    
    
    
    
    
    
    

