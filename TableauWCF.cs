using System.Data.OleDb;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeafWCFRest.Utility;
using LeafWCFRest.Model;
using System.Web.Script.Serialization;
using System.Data;
using System.Collections.Specialized;
using System.Data.SqlClient;
using Microsoft.SqlServer.TransactSql.ScriptDom;
using System.DirectoryServices.AccountManagement;
using System.Collections;  // for PrincipalContext
using System.Xml;
using System.Xml.Linq;
using System.Net;
using System.IO;
using System.Net.NetworkInformation;
using Tableau;

namespace LeafWCFRest.Utility
{
    public class TableauDataSet
    {
        public DataTable DataSet { get; set; }
        public string DataSetName { get; set; }

        public TableauDataSet()
        {
            DataSet = new DataTable();
        }
    }

    public class TableauExtract
    {
        public DataTable ProjectParameters { get; set; }
        public DataTable ProjectData { get; set; }
        public DataTable Metadata { get; set; }
        public DataTable Events { get; set; }
        public DataTable EventMappings { get; set; }
        public List<REDCapDataSet> DataSets { get; set; }
        public string SuperToken { get; set; }

        public TableauExtract()
        {

            ProjectParameters = new DataTable();
            ProjectData = new DataTable();
            Metadata = new DataTable();
            Events = new DataTable();
            EventMappings = new DataTable();
        }
    }
 

    public class TableauSync
    {
        
         public string CreateTableauDataExtract(DataTable dataTable, string file)
        {
            Extract output = new Extract(file);
            // initialize the extract object, which we will output
            using (output)
            // create a new Tableau table based on the DataTable
            using (Tableau.TableDefinition tableDefinition = new Tableau.TableDefinition())
            {
                // ForEach Column
                foreach (DataColumn dc in dataTable.Columns)
                {
                    string columnName = dc.ColumnName;
                    System.Type columnType = dc.DataType;
                    string columnTypeString = columnType.ToString();

                    switch (columnTypeString)
                    {
                        case "System.String":
                            tableDefinition.AddColumn(columnName, Tableau.Type.Type_UnicodeString);
                            break;

                        case "System.DateTime":
                            tableDefinition.AddColumn(columnName, Tableau.Type.Type_DateTime);
                            break;

                        case "System.Int32":
                            tableDefinition.AddColumn(columnName, Tableau.Type.Type_Integer);
                            break;

                        case "System.Double":
                            tableDefinition.AddColumn(columnName, Tableau.Type.Type_Double);
                            break;

                        case "System.Decimal":
                            tableDefinition.AddColumn(columnName, Tableau.Type.Type_Double);
                            break;

                        case "System.Boolean":
                            tableDefinition.AddColumn(columnName, Tableau.Type.Type_Boolean);
                            break;
                    }
                }

                Tableau.Table table = output.AddTable("Extract", tableDefinition);

                // loop through each row
                foreach (DataRow dr in dataTable.Rows)
                {
                    Row row = new Row(tableDefinition);

                    // loop through each column while in the row
                    foreach (DataColumn dc in dataTable.Columns)
                    {
                        object value = dr[dc.ColumnName];

                        string columnName = dc.ColumnName;
                        System.Type columnType = dc.DataType;
                        string columnTypeString = columnType.ToString();


                        if (!string.IsNullOrWhiteSpace(value.ToString()))
                        {
                            switch (columnTypeString)
                            {
                                case "System.String":
                                    row.SetString(dc.Ordinal, value.ToString());
                                    break;

                                case "System.DateTime":
                                    DateTime dateValue = DateTime.Parse(value.ToString());
                                    row.SetDateTime(dc.Ordinal, dateValue.Year, dateValue.Month, dateValue.Day, dateValue.Hour, dateValue.Minute, dateValue.Second, dateValue.Millisecond);
                                    break;

                                case "System.Int32":
                                    row.SetInteger(dc.Ordinal, Convert.ToInt32(value.ToString()));
                                    break;

                                case "System.Double":
                                    row.SetDouble(dc.Ordinal, Convert.ToDouble(value.ToString()));
                                    break;

                                case "System.Decimal":
                                    row.SetDouble(dc.Ordinal, Convert.ToDouble(value.ToString()));
                                    break;

                                case "System.Boolean":
                                    row.SetBoolean(dc.Ordinal, Convert.ToBoolean(value.ToString()));
                                    break;
                            }
                        }
                    }
                    table.Insert(row);
                }

            }
            return file;
        }

        public string LoginToTableau(string username, string password)
        {
            //Create XML payload for the api call.  
            using (XmlWriter loginxml = XmlWriter.Create("login.xml"))
            {
                loginxml.WriteStartDocument();
                loginxml.WriteStartElement("tsRequest");
                loginxml.WriteStartElement("credentials");
                loginxml.WriteAttributeString("name", username);
                loginxml.WriteAttributeString("password", password);
                loginxml.WriteStartElement("site");
                loginxml.WriteAttributeString("contentUrl", "");
                loginxml.WriteEndElement();
                loginxml.WriteEndElement();
                loginxml.WriteEndElement();
                loginxml.WriteEndDocument();
            }
            XElement myxml = XElement.Load("login.xml");

            //Convert the XML payload to a string and display so we can check that it's well-formed  
            string myxmlstring = myxml.ToString();
            string urltl = "https://10.67.24.198:443/api/2.4/auth/signin";
            //Send the above url, the POST method, and the XML Payload string to create the web request  
            var infotl = SendWebRequest(urltl, "POST", myxmlstring, "text/xml", "");

            Console.WriteLine(infotl);
            //XNamespace ns = "http://tableausoftware.com/api";

            var root = XElement.Parse(infotl);
            XNamespace ns = root.GetDefaultNamespace();
            var token = root.Element(ns + "credentials").Attribute("token").Value;
                         
            return token;
        }

        public string GetTableauTicket()
        {
            var user = "xiyao111"; //UserInformation.GetAuthenticatedUsername();
            var request = (HttpWebRequest)WebRequest.Create("http://tabdev.uwmedicine.org/trusted");

            var encoding = new UTF8Encoding();
            var postData = "username=" + user;
            //postData += "&target_site=<sitename>";
            byte[] data = encoding.GetBytes(postData);

            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = data.Length;

            using (var stream = request.GetRequestStream())
            {
                stream.Write(data, 0, data.Length);
            }

            var response = (HttpWebResponse)request.GetResponse();
            return new StreamReader(response.GetResponseStream()).ReadToEnd();
        }

        public string InitiateFileUpload(string username, string password)
        {
            var token = LoginToTableau(username, password);

            string urltl = "https://10.67.24.198:443/api/2.4/sites/1a10f5b9-029b-43e4-a620-773d1690338c/fileUploads";
            var infotl = SendWebRequest(urltl, "POST", "", "text/xml", token);
            var root = XElement.Parse(infotl);
            XNamespace ns = root.GetDefaultNamespace();
            var uploadSessionID = root.Element(ns + "fileUpload").Attribute("uploadSessionId").Value;

            return uploadSessionID;
        }

        public string AppendToFileUpload(string file, string uploadSessionID, string username, string password)
        {
            string urltl = "https://10.67.24.198:443/api/2.4/sites/1a10f5b9-029b-43e4-a620-773d1690338c/fileUploads/" + uploadSessionID;
            var boundaryString = Guid.NewGuid().ToString().Replace("-", string.Empty);
              
            var header =
                "--" + boundaryString + "\r\n" +
                "Content-Disposition: name=\"request_payload\"\r\n" +
                "Content-Type: text/xml\r\n\r\n" +
                "--" + boundaryString + "\r\n" +
                "Content-Disposition: name=\"tableau_file\"; filename=\"" + file + "\"\r\n" +
                "Content-Type: application/octet-stream\r\n\r\n";

            //Send the above url, the POST method, and the XML Payload string to create the web request  
            var contentType = "multipart/mixed; boundary=" + boundaryString;
            //var infotl = SendWebRequest(urltl, "POST", header, contentType, token);
            var infotl = MakeRequestWithFile(urltl, "PUT", contentType, header, boundaryString, file, username, password, HttpStatusCode.Created);
            return infotl;
        }

        public string FinishUpload(string uploadSessionID, string fileType, string username, string password)
        {
            var token = LoginToTableau(username, password);
            string urltl = "https://10.67.24.198:443/api/2.4/sites/1a10f5b9-029b-43e4-a620-773d1690338c/datasource?uploadSessionId=" + uploadSessionID
                            + "&datasourceType=" + fileType;
            using (XmlWriter dsxml = XmlWriter.Create("finish.xml"))
            {
                dsxml.WriteStartDocument();
                dsxml.WriteStartElement("tsRequest");
                dsxml.WriteStartElement("datasource");
                dsxml.WriteAttributeString("name", "test");
                //dsxml.WriteStartElement("connectionCredentials");
                //dsxml.WriteAttributeString("name", "xiyao111");
                //dsxml.WriteAttributeString("password", "925473#Yaya");
                //dsxml.WriteAttributeString("embed", "true");
                //dsxml.WriteEndElement();
                dsxml.WriteStartElement("project");
                dsxml.WriteAttributeString("id", "4fbca645-8a6b-4d4e-ba4f-e6fa12a56f09");
                dsxml.WriteEndElement();
                dsxml.WriteEndElement();
                dsxml.WriteEndDocument();
            }
            XElement myxml = XElement.Load("ds.xml");


            //Convert the XML payload to a string and display so we can check that it's well-formed  
            string myxmlstring = myxml.ToString();
            System.Console.WriteLine(myxmlstring);
            System.Console.WriteLine();
            var boundaryString = Guid.NewGuid().ToString().Replace("-", string.Empty);
            var newline = "\r\n";

            string boundary_start = "--" + boundaryString + newline +
                                    "Content-Disposition: name=\"request_payload\"" + newline +
                                    "Content-Type: text/xml";

            var payload = boundary_start + newline + newline + myxmlstring + newline + "--" + boundaryString + "--";

            var contentType = "multipart/mixed; boundary=" + boundaryString;
            return SendWebRequest(urltl, "POST", payload, contentType, token);
        }

        public string PublishSingleDataSourceToTableau(string file, string datasourceName, string username, string password)
        {
            ////Create XML payload for the api call. 
            //using (XmlWriter dsxml = XmlWriter.Create("ds.xml"))
            //{
            //    dsxml.WriteStartDocument();
            //    dsxml.WriteStartElement("tsRequest");
            //    dsxml.WriteStartElement("workbook");
            //    dsxml.WriteAttributeString("name", "test");
            //    //dsxml.WriteStartElement("connectionCredentials");
            //    //dsxml.WriteAttributeString("name", "xiyao111");
            //    //dsxml.WriteAttributeString("password", "925473#Yaya");
            //    //dsxml.WriteAttributeString("embed", "true");
            //    //dsxml.WriteEndElement();
            //    dsxml.WriteStartElement("project");
            //    dsxml.WriteAttributeString("id", "4fbca645-8a6b-4d4e-ba4f-e6fa12a56f09");
            //    dsxml.WriteEndElement();
            //    dsxml.WriteEndElement();
            //    dsxml.WriteEndDocument();
            //}
            //XElement myxml = XElement.Load("ds.xml");


            ////Convert the XML payload to a string and display so we can check that it's well-formed  
            //string myxmlstring = myxml.ToString();
            //System.Console.WriteLine(myxmlstring);
            //System.Console.WriteLine();

            //var boundaryString = Guid.NewGuid().ToString().Replace("-", string.Empty);
            //var newline = "\r\n";

            //string boundary_start = "--" + boundaryString + newline +
            //                        "Content-Disposition: name=\"request_payload\"" + newline +
            //                        "Content-Type: text/xml";
            //string boundary_end = "--" + boundaryString + newline +
            //                        "Content-Disposition: name=\"tableau_workbook\"; filename=\"Book4.twbx\"" + newline +
            //                        "Content-Type: application/octet-stream";
            

            //var datasourceBytes = File.ReadAllBytes(file).ToList();
            //var payload = boundary_start + newline + newline + myxmlstring + newline + boundary_end + newline + newline +
            //              string.Concat(datasourceBytes.Select(b => Convert.ToString(b, 2).PadLeft(8, '0'))) + newline + "--" + boundaryString + "--";

            var boundaryString = Guid.NewGuid().ToString().Replace("-", string.Empty);
            var header =
                "--" + boundaryString + "\r\n" +
                "Content-Disposition: name=\"request_payload\"\r\n" +
                "Content-Type: text/xml\r\n\r\n" +
                "<tsRequest>\r\n" +
                "  <datasource name=\"" + datasourceName + "\">\r\n" +
                "    <project id=\"4fbca645-8a6b-4d4e-ba4f-e6fa12a56f09\" />\r\n" +
                "  </datasource>\r\n" +
                "</tsRequest>\r\n\r\n" +
                "--" + boundaryString + "\r\n" +
                "Content-Disposition: name=\"tableau_datasource\"; filename=\"" + file + "\"\r\n" +
                "Content-Type: application/octet-stream\r\n\r\n";


            string urltl = "https://10.67.24.198:443/api/2.4/sites/1a10f5b9-029b-43e4-a620-773d1690338c/datasources?overwrite=true";

            //Send the above url, the POST method, and the XML Payload string to create the web request  
            var contentType = "multipart/mixed; boundary=" + boundaryString;
            //var infotl = SendWebRequest(urltl, "POST", header, contentType, token);
            var infotl = MakeRequestWithFile(urltl, "POST", contentType, header, boundaryString, file, username, password, HttpStatusCode.Created);
            return infotl;
        }

        public string MakeRequestWithFile(string url, string method, string contentType, string header, string boundary, string file, string username, string password, params HttpStatusCode[] statusCodes)
        {
            var acceptedCodes = new List<HttpStatusCode>();
            acceptedCodes.Add(HttpStatusCode.OK);

            foreach (var statusCode in statusCodes)
            {
                acceptedCodes.Add(statusCode);
            }

            var signIn = LoginToTableau(username, password);

            var request = (HttpWebRequest)WebRequest.Create(url);

            request.Method = method;
            request.ContentType = contentType;
            request.Headers.Add("X-Tableau-Auth", signIn);


            var headerBytes = Encoding.UTF8.GetBytes(header).ToList();
            var datasourceBytes = File.ReadAllBytes(file).ToList(); 
            var newlineBytes = Encoding.UTF8.GetBytes("\r\n").ToList();
            var endBytes = Encoding.UTF8.GetBytes("--" + boundary + "--").ToList();

            var bytes = headerBytes.Concat(datasourceBytes).Concat(newlineBytes).Concat(endBytes).ToArray();
            request.ContentLength = bytes.Length;

            using (var writeStream = request.GetRequestStream())
            {
                writeStream.Write(bytes, 0, bytes.Length);
            }

            var responseValue = string.Empty;

            try
            {
                using (var response = (HttpWebResponse)request.GetResponse())
                {
                    if (acceptedCodes.All(c => c != response.StatusCode))
                    {
                        var message = String.Format("Request failed. Received HTTP {0}", response.StatusCode);
                        
                        throw new ApplicationException(message);
                    }

                    // grab the response
                    using (var responseStream = response.GetResponseStream())
                    {
                        if (responseStream != null)
                            using (var reader = new StreamReader(responseStream))
                            {
                                responseValue = reader.ReadToEnd();
                            }
                    }
                }
            }
            catch (WebException ex)
            {
                if (ex.Message.Contains("(409) Conflict"))
                {
                    return null;
                }


                responseValue = ((HttpWebResponse)ex.Response).StatusCode.ToString();
            }
            return responseValue;
        }

        public string QuerySites(string username, string password)
        {
            var token = LoginToTableau(username, password);
            string urltl = "https://10.67.24.198:443/api/2.4/sites";
            return SendWebRequest(urltl, "GET", "", "text/xml", token);
        }
        public string QueryProjects(string username, string password)
        {
            var token = LoginToTableau(username, password);
            string urltl = "https://10.67.24.198:443/api/2.4/sites/1a10f5b9-029b-43e4-a620-773d1690338c/projects";
            //Research project id=4fbca645-8a6b-4d4e-ba4f-e6fa12a56f09
            return SendWebRequest(urltl, "GET", "","text/xml",token);
        }
        public string QueryDataSources(string username, string password)
        {
            var token = LoginToTableau(username, password);
            string urltl = "https://10.67.24.198:443/api/2.4/sites/1a10f5b9-029b-43e4-a620-773d1690338c/datasources";
            return SendWebRequest(urltl, "GET", "", "text/xml", token);
        }

        private string SendWebRequest(string Url, string Method, string Payload, string ContentType, string Token)
        {
            string response;


            //encode the XML payload  
            byte[] buf = Encoding.UTF8.GetBytes(Payload);


            //set the system to ignore certificate errors because Tableau server has an invalid cert.  
            System.Net.ServicePointManager.ServerCertificateValidationCallback = ((sender, certificate, chain, sslPolicyErrors) => true);


            //Create the web request and add the XML payload  
            HttpWebRequest wc = WebRequest.Create(Url) as HttpWebRequest;
            wc.Method = Method;
            wc.ContentType = ContentType;
            wc.ContentLength = buf.Length;
            if (wc.Method != "GET"){
                wc.GetRequestStream().Write(buf, 0, buf.Length);
            }
            wc.Headers.Add("X-Tableau-Auth", Token);


            System.Console.WriteLine("DEBUG::: wc.Headers.ToString is " + wc.Headers.ToString());
            try
            {
                //Send the web request and parse the response into a string  
                HttpWebResponse wr = wc.GetResponse() as HttpWebResponse;
                Stream receiveStream = wr.GetResponseStream();
                StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8);
                response = readStream.ReadToEnd();


                receiveStream.Close();
                readStream.Close();
                wr.Close();


                readStream.Dispose();
                receiveStream.Dispose();
            }
            catch (WebException we)
            {
                //Catch failed request and return the response code  
                response = ((HttpWebResponse)we.Response).StatusCode.ToString();
            }
            return response;

        }
    }
}
