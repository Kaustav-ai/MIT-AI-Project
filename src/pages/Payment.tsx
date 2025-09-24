import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type PaymentMethod = "card" | "qr" | "upi";

interface PaymentState {
  doctorId?: string;
  doctorName?: string;
  consultationType?: "video" | "audio" | "chat";
  fee?: number; // in local currency
}

const DEFAULT_FEE = 50; // fallback USD style, but project shows INR; handled via currency

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as PaymentState;

  const [method, setMethod] = useState<PaymentMethod>("card");

  // Card form
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI form
  const [upiId, setUpiId] = useState("");

  const feeDisplay = useMemo(() => {
    const amount = state.fee ?? DEFAULT_FEE;
    // If price hints INR in Doctors page, keep INR; otherwise default to $
    // We'll infer by presence of a large fee (e.g., 550) and use INR symbol.
    const isLikelyINR = amount > 100;
    return {
      amount,
      currencySymbol: isLikelyINR ? "₹" : "$",
    };
  }, [state.fee]);

  const validate = (): string | null => {
    if (method === "card") {
      if (!cardNumber || cardNumber.replace(/\s+/g, "").length < 12) return "Enter a valid card number";
      if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Enter expiry as MM/YY";
      if (!/^\d{3,4}$/.test(cvv)) return "Enter a valid CVV";
    }
    if (method === "upi") {
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) return "Enter a valid UPI ID (e.g., name@bank)";
    }
    // QR has no form fields
    return null;
  };

  const simulateProcessing = async () => {
    await new Promise((r) => setTimeout(r, 800));
  };

  const handlePay = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }
    try {
      await simulateProcessing();
      alert(`Payment successful via ${method.toUpperCase()} for ${feeDisplay.currencySymbol}${feeDisplay.amount}.`);
      navigate("/doctors");
    } catch (e) {
      alert("Payment failed. Please try again.");
    }
  };

  const qrValue = useMemo(() => {
    const amount = state.fee ?? DEFAULT_FEE;
    // Placeholder QR payload
    return `PAYMENT|doctor=${state.doctorId ?? "unknown"}|amount=${amount}`;
  }, [state.fee, state.doctorId]);

  return (
    <Layout>
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>
                {state.doctorName ? `Booking consultation with ${state.doctorName}` : "Complete your consultation booking"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Consultation Fee</p>
                  <p className="text-2xl font-bold">{feeDisplay.currencySymbol}{feeDisplay.amount}</p>
                </div>
                {state.consultationType && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{state.consultationType}</p>
                  </div>
                )}
              </div>

              <Separator />

              <Tabs value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="card">Card</TabsTrigger>
                  <TabsTrigger value="qr">QR Code</TabsTrigger>
                  <TabsTrigger value="upi">UPI / Wallet</TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Card Number</label>
                    <Input
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Expiry (MM/YY)</label>
                      <Input
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">CVV</label>
                      <Input
                        inputMode="numeric"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="qr" className="space-y-4 pt-4">
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(qrValue)}`}
                      alt="Payment QR code"
                      className="rounded bg-white p-2 border"
                      width={192}
                      height={192}
                    />
                    <p className="text-sm text-muted-foreground">Scan with any supported app to pay</p>
                    <Button variant="outline" onClick={() => alert("Opening camera to scan (placeholder)")}>Scan QR Code</Button>
                  </div>
                </TabsContent>

                <TabsContent value="upi" className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm text-muted-foreground">UPI ID</label>
                    <Input
                      placeholder="username@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handlePay}>Book Consultation</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Payment;
