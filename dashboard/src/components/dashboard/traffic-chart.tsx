"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HourlyTraffic } from "@/services/api";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TrafficChartProps {
    data: HourlyTraffic[];
}

export function TrafficChart({ data }: TrafficChartProps) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Tráfego de Mensagens por Hora</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="hour"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="inbound"
                            name="Recebidas"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorInbound)"
                        />
                        <Area
                            type="monotone"
                            dataKey="outbound"
                            name="Enviadas"
                            stroke="#82ca9d"
                            fillOpacity={1}
                            fill="url(#colorOutbound)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
