<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\PurchaseHistory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class productController extends Controller
{
    public function getProducts()
    {
        $products = Product::with(['user','products'])->get();
        return response()->json($products);
    }



    public function store(Request $request)
    {
        // Define validation rules
        $validator = Validator::make($request->all(), [
            'products.*.name' => 'required|string',
            'products.*.user_phone' => 'required|string',
            'products.*.product_name' => 'required|string',
            'products.*.product_code' => 'required|string',
            'products.*.product_price' => 'required|numeric',
            'products.*.purchase_quantity' => 'required|integer',
            'products.*.order_no' => 'required|integer',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $response = [];

        // Clean old data
        foreach ($validatedData['products'] as $item) {
            // Assuming you want to delete old data for the user before inserting new data
            User::where('user_phone', $item['user_phone'])->delete();
            PurchaseHistory::where('order_no', $item['order_no'])->delete();
        }

        foreach ($validatedData['products'] as $item) {
            // Create or find user
            $user = User::create([
                'name' => $item['name'],
                'user_phone' => $item['user_phone'],
            ]);

            // Create purchase history
            $purchaseHistory = PurchaseHistory::create([
                'order_no' => $item['order_no'],
                'product_name' => $item['product_name'],
                'product_code' => $item['product_code'],
                'product_price' => $item['product_price'],
                'purchase_quantity' => $item['purchase_quantity'],
                'total' => $item['purchase_quantity'] * $item['product_price'],
            ]);

            // Create or update product entry
            $product = Product::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'product_id' => $purchaseHistory->id,
                ],
            );

            $response[] = $product;
        }

        return response()->json($response);
    }
}
