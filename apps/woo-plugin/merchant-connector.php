<?php
/**
 * Plugin Name: Auto-Stock Merchant Connector
 * Description: Two-way inventory sync with Auto-Stock. Pairing, webhooks, initial import.
 * Version: 0.1.0
 * Author: Auto-Stock
 * Text Domain: auto-stock-connector
 */

defined('ABSPATH') || exit;

define('AUTO_STOCK_CONNECTOR_VERSION', '0.1.0');

final class Auto_Stock_Merchant_Connector {
  public static function init() {
    add_action('rest_api_init', [__CLASS__, 'register_routes']);
  }

  public static function register_routes() {
    register_rest_route('auto-stock/v1', '/pair', [
      'methods' => 'POST',
      'callback' => [__CLASS__, 'pair'],
      'permission_callback' => '__return_true',
      'args' => [
        'code' => ['required' => true, 'type' => 'string'],
        'site_url' => ['required' => true, 'type' => 'string'],
      ],
    ]);
    register_rest_route('auto-stock/v1', '/webhook', [
      'methods' => 'POST',
      'callback' => [__CLASS__, 'webhook'],
      'permission_callback' => '__return_true',
    ]);
    register_rest_route('auto-stock/v1', '/import', [
      'methods' => 'POST',
      'callback' => [__CLASS__, 'import'],
      'permission_callback' => [__CLASS__, 'verify_signature'],
    ]);
  }

  public static function pair(WP_REST_Request $request) {
    $code = $request->get_param('code');
    $site_url = $request->get_param('site_url');
    if (empty($code) || empty($site_url)) {
      return new WP_Error('invalid', 'code and site_url required', ['status' => 400]);
    }
    return rest_ensure_response(['ok' => true, 'message' => 'Pairing (mock)']);
  }

  public static function webhook(WP_REST_Request $request) {
    $sig = $request->get_header('X-Auto-Stock-Signature');
    $ts = $request->get_header('X-Auto-Stock-Timestamp');
    $nonce = $request->get_header('X-Auto-Stock-Nonce');
    if (empty($sig) || empty($ts) || empty($nonce)) {
      return new WP_Error('unauthorized', 'Missing signature headers', ['status' => 401]);
    }
    return rest_ensure_response(['ok' => true]);
  }

  public static function import(WP_REST_Request $request) {
    return rest_ensure_response(['ok' => true, 'imported' => 0]);
  }

  public static function verify_signature(WP_REST_Request $request) {
    $sig = $request->get_header('X-Auto-Stock-Signature');
    return !empty($sig);
  }
}

add_action('plugins_loaded', ['Auto_Stock_Merchant_Connector', 'init']);
