
from django.db import models

# Create your models here.
class metricsTable(models.Model):
	hgnc = models.CharField(max_length=40, primary_key=True)
	mean = models.FloatField()
	cov = models.FloatField()
	mfc = models.FloatField()

class description(models.Model):
	gene_name = models.ForeignKey(metricsTable, to_field='hgnc')
	description = models.TextField()
	summary = models.TextField()
	entrezid = models.TextField	()


