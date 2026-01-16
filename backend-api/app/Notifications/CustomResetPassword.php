<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomResetPassword extends Notification
{
    use Queueable;

    public $token;

    // 1. Accept the token in the constructor
    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    // 2. Customize the email here
    public function toMail($notifiable)
    {
        // Build the Frontend Link
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5174');
        $resetUrl = "{$frontendUrl}/reset-password?token={$this->token}&email={$notifiable->getEmailForPasswordReset()}";

        return (new MailMessage)
            ->subject('Urgent: Elite Manager Security Override') // Custom Subject
            ->greeting('Greetings, Commander ' . $notifiable->name) // Custom Greeting
            ->line('We received a request to override the security protocols for your account.')
            ->line('If this was you, please authorize the reset sequence below:')
            ->action('Initialize Reset Protocol', $resetUrl) // Button Text & Link
            ->line('If you did not request a password reset, ignore this transmission. Your ship is safe.');
    }
}