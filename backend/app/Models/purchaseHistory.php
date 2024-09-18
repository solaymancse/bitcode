<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class purchaseHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_no',
        'product_name',
        'product_code',
        'product_price',
        'purchase_quantity',
        'total',

    ];
}
