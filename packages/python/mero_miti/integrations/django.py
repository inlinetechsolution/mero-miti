"""
Django Form and Model Field Integration for Mero Miti.
"""

try:
    from django import forms
    from django.core.exceptions import ValidationError
    from ..core import parse_bs_date, bs_to_ad, ad_to_bs, format_bs_date, BsDate

    class BsDateWidget(forms.TextInput):
        """
        Widget rendering input field with Mero Miti companion markup.
        """
        def __init__(self, attrs=None, format="DD/MM/YYYY"):
            default_attrs = {
                "class": "mero-miti-input",
                "placeholder": format,
                "data-mero-miti-auto": "true",
                "data-mero-miti-format": format
            }
            if attrs:
                default_attrs.update(attrs)
            super().__init__(default_attrs)

    class BsDateField(forms.Field):
        """
        A Django Form field that accepts Bikram Sambat date inputs and converts
        them into standard Python datetime.date (A.D.) for backend database storage.
        """
        widget = BsDateWidget

        def __init__(self, format="DD/MM/YYYY", locale="ne", *args, **kwargs):
            self.format = format
            self.locale = locale
            super().__init__(*args, **kwargs)

        def to_python(self, value):
            if not value:
                return None
            res = parse_bs_date(str(value), format=self.format, locale=self.locale)
            if not res.is_valid:
                raise ValidationError(res.error or "Invalid Nepali date.")
            return bs_to_ad(res.parsed)

        def prepare_value(self, value):
            if value and hasattr(value, "year"):
                # If Gregorian date is provided, format as B.S. for the widget
                bs = ad_to_bs(value)
                return format_bs_date(bs, format=self.format)
            return value

except ImportError:
    pass
