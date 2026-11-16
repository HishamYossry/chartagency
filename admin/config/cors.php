<?php

// Only the public website may call the API from a browser (the lead form).
return [

    'paths' => ['api/*'],

    'allowed_methods' => ['GET', 'POST', 'OPTIONS'],

    'allowed_origins' => array_values(array_filter([
        rtrim((string) env('FRONTEND_URL'), '/'),
        // www variant of the production domain
        str_replace('://', '://www.', rtrim((string) env('FRONTEND_URL'), '/')),
    ])),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'Accept', 'X-Requested-With'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => false,

];
