<?php
include_once "lib/class.phpmailer.php";

function getResponseJSONString($error_exist, $error_no, $error_msg, $data) {
    $ret = array();
    $ret['error_exist'] = $error_exist;
    $ret['error_no'] = $error_no;
    $ret['error_msg'] = $error_msg;
    $ret['data'] = $data;
    return json_encode($ret);
}

class EmailTemplate {
    public function render($data) {
        $body = "";
        
        foreach($data as $key => $value){
            $body .= "<b>" . ucfirst($key) . ":</b> $value<br/><br/>";
        }
        return $body;
    }
}

class StaticHtmlEmailTemplate extends EmailTemplate{
    public $file;
    public function render($data) {
        return file_get_contents ( $this->file );
    }
}

class Mail {
    public $templateData;
    public $template;
    public $config;
    public $subject = "Registration";
    public $addresses;
    public $from = array("mail.infradesign.com.my", "no-reply@infradesign.com.my");
    public function send() {
        $body = $this->template->render($this->templateData);
        $subject = $this->subject;
        
        $mailer = new PHPMailer();
        $mailer->IsSMTP();
        $mailer->SMTPDebug = false;
        $mailer->SMTPAuth = true;
        $mailer->Host = $this->config['smtp']['host'];
        $mailer->Port = $this->config['smtp']['port'];
        $mailer->Username = $this->config['smtp']['user'];
        $mailer->Password = $this->config['smtp']['pass'];
        $mailer->CharSet = "UTF-8";
        $mailer->SetFrom($this->from[1], $this->from[0]);
        foreach($this->addresses as $k => $address) {
            $mailer->AddAddress($address[0], $address[1]);
        }
        $mailer->Subject = $subject;
        $mailer->MsgHTML($body);
        
        if(!$mailer->send()) {
            return FALSE;
        }else{
            return TRUE;   
        }
    }
}
?>