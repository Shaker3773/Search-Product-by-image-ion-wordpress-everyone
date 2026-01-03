<?php
if (!defined('ABSPATH')) exit;
use Elementor\Widget_Base;

class AI_Image_Product_Search_Widget extends Widget_Base {
    public function get_name(){ return 'ai_image_product_search'; }
    public function get_title(){ return 'AI Image Product Search'; }
    public function get_icon(){ return 'eicon-search'; }
    public function get_categories(){ return ['general']; }
    protected function render(){
        echo do_shortcode('[ai_image_product_search]');
    }
}
