from django.views import generic


class MonitorView(generic.TemplateView):
    template_name = 'zmonitor/zmonitor.html'
