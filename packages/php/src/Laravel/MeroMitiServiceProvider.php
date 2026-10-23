<?php

namespace MeroMiti\Laravel;

/**
 * Mero Miti Service Provider for auto-registering Laravel validation directives.
 */
class MeroMitiServiceProvider
{
    public function boot(): void
    {
        if (class_exists('\\Illuminate\\Support\\Facades\\Validator')) {
            \Illuminate\Support\Facades\Validator::extend('bs_date', function ($attribute, $value, $parameters, $validator) {
                $format = $parameters[0] ?? 'DD/MM/YYYY';
                $locale = $parameters[1] ?? 'ne';
                $rule = new ValidBsDate($format, $locale);
                return $rule->passes($attribute, $value);
            });
        }
    }

    public function register(): void
    {
        // No bindings needed
    }
}
