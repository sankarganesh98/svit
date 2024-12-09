from django.db import models

class Participant(models.Model):
    name = models.CharField(max_length=100)
    date_joined = models.DateField()
    employed = models.BooleanField(default=False)
    income = models.FloatField(default=0.0)
    tax_contributions = models.FloatField(default=0.0)
    reoffended = models.BooleanField(default=False)
    sobriety_status = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class ProgramCost(models.Model):
    year = models.IntegerField()
    cost = models.FloatField()

    def __str__(self):
        return f"{self.year} - {self.cost}"

class CrimeData(models.Model):
    region = models.CharField(max_length=100)
    crime_rate = models.FloatField()
    crime_cost = models.FloatField()

    def __str__(self):
        return self.region
