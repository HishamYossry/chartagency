<?php

namespace App\Notifications;

use App\Models\Lead;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewLead extends Notification
{
    public function __construct(private readonly Lead $lead) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $lead = $this->lead;
        $whatsapp = 'https://wa.me/'.preg_replace('/\D+/', '', $lead->phone);

        return (new MailMessage)
            ->subject('New lead: '.$lead->name.($lead->practice ? ' — '.$lead->practice : ''))
            ->greeting('New strategy call request')
            ->line('**Name:** '.$lead->name)
            ->line('**Phone / WhatsApp:** '.$lead->phone)
            ->line('**Practice:** '.($lead->practice ?: '—'))
            ->line('**Specialty:** '.($lead->specialty ?: '—'))
            ->line('**Website language:** '.strtoupper($lead->locale))
            ->action('Open in admin', url('/leads/'.$lead->id.'/edit'))
            ->line('Reply on WhatsApp: '.$whatsapp);
    }
}
