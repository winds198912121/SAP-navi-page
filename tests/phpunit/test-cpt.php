<?php
/**
 * Test class for SAP Panda CPT Registration
 *
 * @package SAP_Panda_API
 */

class Test_CPT_Registration extends WP_UnitTestCase {

    private $cpt;

    public function setUp(): void {
        parent::setUp();
        $this->cpt = new SAP_Panda_CPT();
        $this->cpt->register();
    }

    public function test_course_cpt_exists() {
        $this->assertTrue(post_type_exists('course'));
    }

    public function test_daily_quiz_cpt_exists() {
        $this->assertTrue(post_type_exists('daily_quiz'));
    }

    public function test_learning_path_cpt_exists() {
        $this->assertTrue(post_type_exists('learning_path'));
    }

    public function test_sap_case_cpt_exists() {
        $this->assertTrue(post_type_exists('sap_case'));
    }

    public function test_cpt_is_public() {
        $cpt = get_post_type_object('course');
        $this->assertTrue($cpt->public);
    }

    public function test_cpt_has_rest_support() {
        $cpt = get_post_type_object('course');
        $this->assertTrue($cpt->show_in_rest);
    }
}
