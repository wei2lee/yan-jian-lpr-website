<?php
include_once "config.php";
include_once "util.php";
header('Content-Type: application/json');
$action = array_key_exists('action', $_GET) ? $_GET['action'] : '';
$target = array_key_exists('target', $_GET) ? $_GET['target'] : '';
if($action == 'add' && $target == 'user') {
	$data = array(
        'title'=>'', 
        'name'=>'', 
        'date-of-birth'=>'', 
        'age-group'=>'',
        'nationality'=>'',
        'email'=>'',
        'gender'=>'',
        'telephone'=>'',
        'mobile'=>'',
        'purpose-of-purchase'=>'',
        'source-of-awareness'=>'',
        'address'=>'',
        'postcode'=>'',
        'city'=>'',
        'state'=>'',
        'country'=>'',
        'preferred-mode-of-communication'=>'',
        'interested-property-type'=>'',
        'preferred-price-range'=>'',
        'receive-update'=>'',
        'residential-status'=>'',
        'family-structure'=>'',
        'interested-area'=>'',
        'tnc-agreement'=>''
    );
	foreach($data as $key => &$val){
		if(array_key_exists($key, $_POST)){
			$val = $_POST[$key];
		}else{
            $val = '';
			echo getResponseJSONString(1, 0, "Argument '$key' is not existed.", '');
			//return;
		}
	}
	$addresses = array();
	$addresses[] = array('info@lakepointresidence.com.my', 'info@lakepointresidence.com.my');
	//$addresses[] = array('wei2lee86@gmail.com', 'wei2lee86@gmail.com');

	$mail = new Mail();
	$mail->config = $config;
    $mail->from = array("no-reply@lakepointresidence.com.my", "no-reply@lakepointresidence.com.my");
	$mail->subject = "Microsite lakepointresidence.com.my(2014) Registration";
	$mail->template = new EmailTemplate();
	$mail->templateData = $data;
	$mail->addresses = $addresses;
	$ret = $mail->send();
    if(!$ret){
        echo getResponseJSONString(1, 0, "Unable to send email", '');
        die();   
    }
    
    
	$addresses = array();
	$addresses[] = array($data['email'], $data['name']);
	$mail = new Mail();
	$mail->config = $config;
    $mail->from = array("no-reply@lakepointresidence.com.my", "no-reply@lakepointresidence.com.my");
	$mail->subject = "Microsite lakepointresidence.com.my(2014) Registration";
	$mail->template = new StaticHtmlEmailTemplate();
    $mail->template->file = 'reply-template.htm';
	$mail->templateData = $data;
	$mail->addresses = $addresses;
	$ret = $mail->send();
    if(!$ret){
        echo getResponseJSONString(1, 0, "Unable to send email", '');
        die();   
    }
    
    
    echo getResponseJSONString(0, 0, "", '');
}else{
	echo getResponseJSONString(1, 0, "Action is invalid", '');

}
?>
