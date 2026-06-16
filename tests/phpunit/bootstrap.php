<?php
/**
 * PHPUnit Bootstrap for SAP Panda API plugin
 *
 * @package SAP_Panda_API
 */

define('WP_TESTS_DIR', getenv('WP_TESTS_DIR') ?: '/tmp/wordpress-tests-lib');
define('PLUGIN_DIR', dirname(__DIR__, 3) . '/wp-content/plugins/sap-panda-api');

require_once WP_TESTS_DIR . '/includes/functions.php';

tests_add_filter('muplugins_loaded', function () {
    require PLUGIN_DIR . '/sap-panda-api.php';
});

require WP_TESTS_DIR . '/includes/bootstrap.php';
