from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include,re_path
from django.views.decorators.cache import cache_page
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('myreactchiko.urls')),


    re_path(r'^.*$', TemplateView.as_view(
        template_name='index.html'
    )),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
